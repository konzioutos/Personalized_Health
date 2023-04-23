/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import com.google.gson.Gson;
import database.tables.EditMessageTable;
import java.io.IOException;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import mainClasses.JSON_Converter;
import mainClasses.Message;

/**
 *
 * @author KonZioutos
 */
public class Messages extends HttpServlet {

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        int doctorId = -1;
        int userId = -1;
        if (session.getAttribute("doctorId") != null) {
            doctorId = (int) session.getAttribute("doctorId");
        } else if (session.getAttribute("userId") != null) {
            userId = (int) session.getAttribute("userId");
        } else {
            response.setStatus(403);
            response.getWriter().println("Session error");
            return;
        }
        String action = request.getParameter("action");

        try {
            if (action.equalsIgnoreCase("getMessages")) {
                ArrayList<Message> messages = new ArrayList();
                EditMessageTable emt = new EditMessageTable();

                if (doctorId != -1) {
                    messages = emt.databaseToDoctorMessages(doctorId);
                } else if (userId != -1) {
                    messages = emt.databaseToUserMessages(userId);
                }
                String json = new Gson().toJson(messages);
                response.getWriter().write(json);
                response.setStatus(200);
            } else {
                response.setStatus(403);
            }
        } catch (SQLException sqlexc) {
            response.setStatus(403);
            response.getWriter().println("Database error.");
        } catch (ClassNotFoundException cnfexc) {
            response.setStatus(403);
            response.getWriter().println("Uknown error occured.");
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        int doctorId = -1;
        int userId = -1;
        if (session.getAttribute("doctorId") != null) {
            doctorId = (int) session.getAttribute("doctorId");
        } else if (session.getAttribute("userId") != null) {
            userId = (int) session.getAttribute("userId");
        } else {
            response.setStatus(403);
            response.getWriter().println("Session error");
            return;
        }

        try {
            EditMessageTable emt = new EditMessageTable();
            JSON_Converter jc = new JSON_Converter();
            String jsonData = jc.getJSONFromAjax(request.getReader());
            Gson gson = new Gson();
            Message msg = gson.fromJson(jsonData, Message.class);
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = new Date();
            msg.setDate_time(formatter.format(date));
            if (userId == -1) {
                msg.setDoctor_id(doctorId);
            } else if (doctorId == -1) {
                msg.setUser_id(userId);
            }

            emt.createNewMessage(msg);
            response.setStatus((200));
        } catch (ClassNotFoundException cnfexc) {
            response.setStatus(403);
            response.getWriter().println("Uknown error occured.");
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
